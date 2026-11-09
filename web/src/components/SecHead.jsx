// Cabeçalho de seção da prancha: número (§), título e coordenada, com régua por cima.
export default function SecHead({ no, title, coord, lead, id }) {
  return (
    <header className="sec-head" data-reveal>
      <span className="label pt-1.5 !text-signal-text">{no}</span>
      <div className="max-w-3xl">
        <h2 id={id} className="h2">
          {title}
        </h2>
        {lead && <p className="lead mt-4 max-w-2xl">{lead}</p>}
      </div>
      <span className="label hidden pt-1.5 md:block" aria-hidden>
        {coord}
      </span>
    </header>
  )
}
