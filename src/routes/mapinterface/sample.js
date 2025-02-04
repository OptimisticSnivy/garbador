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

// let markers = [
// 	[18.4854, 73.8028],
// 	[18.5452, 73.9081],
// 	[18.5689, 73.9268],
// 	// [18.509, 73.8237],
// 	// [18.4422, 73.8596],
// 	// [18.5301, 73.8703],
// 	// [18.4815, 73.9085],
// 	// [18.5198, 73.8471],
// 	// [18.5463, 73.7826],
// 	// [18.6562, 73.8227],
// 	// [18.7221, 73.8063],
// ];
