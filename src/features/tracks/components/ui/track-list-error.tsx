interface TrackListErrorProps {
  message: string;
}

export const TrackListError = ({ message }: TrackListErrorProps) => (
  <div
    className="flex justify-center items-center h-40 border rounded-md bg-destructive/10 text-destructive"
    data-testid="track-list-error"
  >
    <p>Error loading tracks: {message}</p>
  </div>
);
