async function test() {
  try {
    const r = await fetch('http://localhost:3010/api/download-zip/ai-animal-videos');
    console.log('Status:', r.status);
    const text = await r.text();
    console.log('Body snippet:', text.substring(0, 500));
  } catch (e) {
    console.error(e);
  }
}
test();
