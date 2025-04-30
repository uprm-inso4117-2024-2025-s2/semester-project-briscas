import { useEffect, useRef, useState } from "react";
import { subscribeToLogs, unsubscribeFromLogs, getLogHistory } from "../utils/logStore";

type Props = {
  onClose: () => void;
};

const GameConsole = ({ onClose }: Props) => {
  const [logs, setLogs] = useState<string[]>(getLogHistory()); // ← show past logs
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleLog = (msg: string) => {
      setLogs(prev => [...prev, msg]);
    };

    subscribeToLogs(handleLog);
    return () => unsubscribeFromLogs(handleLog);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "#000000ee",
      color: "#00ff00",
      fontFamily: "monospace",
      overflowY: "auto",
      padding: "20px",
      zIndex: 9999
    }}>
      <button onClick={onClose} style={{
        position: "absolute",
        top: "10px",
        right: "20px",
        backgroundColor: "#222",
        color: "#fff",
        border: "1px solid #555",
        padding: "6px 12px",
        fontSize: "14px",
        cursor: "pointer"
      }}>X</button>

      <h2>🔧 Debug Terminal</h2>
      {logs.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default GameConsole;
