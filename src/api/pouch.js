import PouchDB from 'pouchdb';

export default class PouchApi {
	constructor(dbUrl) {
		this.db = new PouchDB(dbUrl);
	}

	fetchHistoryItems() {
		return this.db.allDocs({
			include_docs: true,
			attachments: true
		}).then(result => result.rows.map(row => row.doc.message));
	}

	putHistoryItem(message) {
		return this.db.post({message});
	}

	createChanges() {
		return this.db.changes({
			since: 'now',
			live: true,
			include_docs: true
		});
	}
}