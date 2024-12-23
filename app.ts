export class Comment {
	id: string;
	userId: string;
	userName: string;
	userGender: string;
	userAvatar: string;
	content: string;
	rating: number;
	isFavorite: boolean;
	date: string;
	replies: Comment[];

	constructor(
		id: string,
		userId: string,
		userName: string,
		userGender: string,
		userAvatar: string,
		content: string
	) {
		this.id = id;
		this.userId = userId;
		this.userName = userName;
		this.userGender = userGender;
		this.userAvatar = userAvatar;
		this.content = content;
		this.rating = 0; // Initialize rating to 0
		this.isFavorite = false;
		this.date = new Date().toISOString(); // Set the current date and time
		this.replies = []; // Initialize replies as an empty array
	}

	toggleFavorite() {
		this.isFavorite = !this.isFavorite;
	}

	rateUp() {
		this.rating = Math.min(this.rating + 1, 5); // Ensure rating does not exceed 5
	}

	rateDown() {
		this.rating = Math.max(this.rating - 1, 0); // Ensure rating does not go below 0
	}

	addReply(reply: Comment) {
		this.replies.push(reply);
	}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}

	getFormattedDate(): string {
		return this.formatDate(this.date);
	}
}