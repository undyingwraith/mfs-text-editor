import Ipfs from 'ipfs-http-client';
import uint8ArrayConcat from 'uint8arrays/concat';

export class MfsEditor {
	private node: any;

	constructor() {
		this.node = Ipfs.create({url: 'http://localhost:5001/api/v0'});
	}

	writeFile(path: string, text: string): Promise<void> {
		return this.node.files.write(path, new TextEncoder().encode(text), {
			create: true, //TODO: make configurable
			parents: true,
		});
	}

	async readFile(path: string) {
		const chunks = [];
		for await (const chunk of this.node.files.read(path)) {
			chunks.push(chunk);
		}

		return new TextDecoder().decode(uint8ArrayConcat(chunks));
	}
	//
	// readFile(path: string): Promise<string> {
	// 	return new Promise<string>((resolve, reject) => {
	// 		this.readFileRaw(path).then(data => {
	// 			resolve(new TextDecoder().decode(data));
	// 		}).catch(reject);
	// 	});
	// }
}
