import Hello from "@/components/hello";

export default function Home() {
  console.log("Home component rendered");
  // ↑ 此日誌會出現在伺服器端
  return (
    <>
      <h1 className="text-3xl">Next.js</h1>
      <Hello />
    </>
  );
}
