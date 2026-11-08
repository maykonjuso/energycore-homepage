import email
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import app as server


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("OUTBOX_DIR", str(tmp_path))
    monkeypatch.delenv("SMTP_HOST", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    server.CONTACT_LIMIT.hits.clear()
    server.ASSISTANT_LIMIT.hits.clear()
    return TestClient(server.app)


FORM = {"name": "Ana Souza", "email": "ana@empresa.com", "company": "Empresa X", "topic": "demonstracao",
        "message": "Quero ver a plataforma funcionando.", "consent": True, "elapsed_ms": 9000}


def test_contact_sends_to_team_and_confirms(client, tmp_path):
    r = client.post("/api/contact", json=FORM)
    assert r.status_code == 200 and r.json()["delivery"] == "outbox"
    mails = [email.message_from_bytes(p.read_bytes()) for p in sorted(Path(tmp_path).glob("*.eml"))]
    assert {m["To"] for m in mails} == {"contato@energycoreconsulting.com.br", "ana@empresa.com"}
    team = next(m for m in mails if m["To"].startswith("contato"))
    assert team["Reply-To"] == "ana@empresa.com" and "Empresa X" in team["Subject"]


def test_contact_rejects_bots_and_bad_input(client, tmp_path):
    assert client.post("/api/contact", json={**FORM, "website": "spam"}).json() == {"ok": True}
    assert client.post("/api/contact", json={**FORM, "elapsed_ms": 300}).json() == {"ok": True}
    assert not list(Path(tmp_path).glob("*.eml"))
    assert client.post("/api/contact", json={**FORM, "email": "x"}).status_code == 422
    assert client.post("/api/contact", json={**FORM, "consent": False}).status_code == 422
    r = client.post("/api/contact", json={**FORM, "company": "A\r\nBcc: x@y.z"})
    assert r.status_code == 200
    subj = [email.message_from_bytes(p.read_bytes())["Subject"] for p in Path(tmp_path).glob("*.eml")]
    assert all("\n" not in s for s in subj)


def test_contact_rate_limit(client):
    for _ in range(5):
        assert client.post("/api/contact", json=FORM).status_code == 200
    assert client.post("/api/contact", json=FORM).status_code == 429


def test_assistant_local_mode(client):
    r = client.post("/api/assistant", json={"messages": [{"role": "user", "content": "Quanto custa?"}]}).json()
    assert r["source"] == "local" and "contato" in r["demos"]
    r = client.post("/api/assistant", json={"messages": [{"role": "user", "content": "Como simular falha na rede?"}]}).json()
    assert "falha" in r["demos"]
    r = client.post("/api/assistant", json={"messages": [{"role": "user", "content": "bom dia"}]}).json()
    assert r["followups"]


def test_assistant_uses_claude_when_configured(client, monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "x")
    calls = {}

    class Block:
        type = "text"
        text = '{"reply": "Oi", "demos": ["topologia", "inventado"], "followups": ["a"]}'

    class Resp:
        stop_reason = "end_turn"
        content = [Block()]

    class Messages:
        async def create(self, **kw):
            calls.update(kw)
            return Resp()

    class Fake:
        class beta:
            messages = Messages()

    monkeypatch.setattr(server, "_client", Fake())
    r = client.post("/api/assistant", json={"messages": [{"role": "user", "content": "Oi"}]}).json()
    assert r == {"reply": "Oi", "demos": ["topologia"], "followups": ["a"], "source": "claude"}
    assert calls["model"] == "claude-opus-5-5" and calls["fallbacks"] == "default"
    assert calls["output_config"]["format"]["type"] == "json_schema"
    assert "base_de_conhecimento" in calls["system"]


def test_security_headers(client):
    h = client.get("/api/health").headers
    assert h["x-frame-options"] == "DENY" and "frame-ancestors 'none'" in h["content-security-policy"]
