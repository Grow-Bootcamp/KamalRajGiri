
type LifecycleLogProps = {
  messages: string[];
};

function LifecycleLog({ messages }: LifecycleLogProps) {
  return (
    <section>
      <h2>Lifecycle Event Log</h2>

      {messages.length === 0 ? (
        <p>No lifecycle events yet.</p>
      ) : (
        <ul>
          {messages.map((message, index) => (
            <li key={`${index}-${message}`}>{message}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default LifecycleLog;
