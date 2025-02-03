import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

const records = await pb.collection("sensors").getFullList({});

for (let i = 0; i < records.length; i++) {
	console.log(records[i].coord);
}
