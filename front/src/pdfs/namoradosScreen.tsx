import namoradosPdf from "./namorados.pdf?url";

const NamoradosScreen = () => {
  return (
    <iframe
      src={namoradosPdf}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
      title="Catálogo Dia dos Namorados"
    />
  );
};

export default NamoradosScreen;

