// El prototipo es un HTML autocontenido servido desde public/prototype/: se embebe en un iframe para que
// /prototype sea una ruta de la app (con o sin barra final) sin mezclar su CSS/JS global con el de React.
export default function PrototypePage() {
  return (
    <iframe
      title="Prototipo ChatG2I"
      src="/prototype/index.html"
      // Es código propio del repo, no contenido de terceros: necesita scripts y same-origin para funcionar,
      // y la descarga de los CSV de Reportes.
      // oxlint-disable-next-line react/iframe-missing-sandbox
      sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals allow-popups"
      className="h-svh w-full border-0"
    />
  )
}
