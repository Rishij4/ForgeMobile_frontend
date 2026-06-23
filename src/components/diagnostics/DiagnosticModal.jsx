export default function DiagnosticModal({ result }) {
  if (!result) return null;

  return (
    <div className="mt-8 bg-zinc-900 p-6 rounded-xl">
      <h2 className="text-2xl mb-4">
        {result.compatible ? "✅ Compatible" : "❌ Issues Found"}
      </h2>

      {result.issues.map((issue, index) => (
        <div key={index} className="mb-2 text-red-500">
          {issue.issue}
        </div>
      ))}
    </div>
  );
}