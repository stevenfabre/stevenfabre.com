import Cursor from "./Cursor";
import { useOthersConnectionIds } from "./liveblocks.config";

export default function Cursors() {
  const ids = useOthersConnectionIds();

  return (
    <div className="pointer-events-none">
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </div>
  );
}
