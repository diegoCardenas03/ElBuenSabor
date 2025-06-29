import { CircularProgress } from "@mui/material";

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-primary z-[9999] gap-4">
      <CircularProgress color="secondary" />
      <h2 className="text-center m-0 text-black">{message}</h2>
    </div>
  );
};