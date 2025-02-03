import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

let coords = [];
async function load() {
	const records = await pb.collection("sensors").getFullList({});

	for (let i = 0; i < records.length; i++) {
		coords[i] = [records[i].lat, records[i].long];
	}
	console.log(coords);
}
load();
