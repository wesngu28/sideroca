import { readFileSync, writeFileSync, readdirSync } from "fs"
const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }
async function query(filename) {
    const response = await fetch(`https://www.nationstates.net/images/cards/s1/${filename.FLAG}`)
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imgname = "test.png"
    writeFileSync(imgname, buffer);

	const data = readFileSync(imgname);
	const response2 = await fetch(
		"https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
		{
			headers: { Authorization: "Bearer " },
			method: "POST",
			body: data,
		}
	);
	const result = await response2.json();
	return result;
}

const folders = readdirSync(process.cwd() + "/cards")

const jsoner = readFileSync("cards/" + folders[0], 'utf-8')
const amantaray = JSON.parse(jsoner).slice(22, 28)
for (const nation of amantaray) {
    console.log(nation.NAME)
    let jayson = await query(nation)
    console.log(jayson)
    await sleep(3000)
}