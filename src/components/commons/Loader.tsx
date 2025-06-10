import { CircularProgress } from "@mui/material";

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Cargando..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        gap: "2vh",
        height: "50vh",
      }}
    >
      <CircularProgress color="secondary" />
      <h2>{message}</h2>
    </div>
  );
};