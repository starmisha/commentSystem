import { Comment } from './app'; // Adjust the import path as necessary

class CommentSystem {
	private comments: Comment[] = [];
	private currentUser: { id: string, name: string, gender: string, avatar: string } = { id: '', name: '', gender: '', avatar: '' };
	private userIdsRated: Set<string> = new Set();
	private sortOptions: string[] = ['Дата', 'Рейтинг', 'Ответы'];
	private currentSortIndex: number = 0;

	constructor() {
		this.loadComments();
		this.loadUser();
		this.initEventListeners();
	}

	private loadComments() {
		const comments = localStorage.getItem('comments');
		if (comments) {
			this.comments = JSON.parse(comments).map((comment: any) => new Comment(
				comment.id,
				comment.userId,
				comment.userName,
				comment.userGender,
				comment.userAvatar,
				comment.content
			));
		} else {
			// Add default comments
			this.comments.push(
				new Comment(
					'1',
					'default-user-id-1',
					'Default User 1',
					'male',
					'https://example.com/default-avatar-1.jpg',
					'Самое обидное, когда сценарий по сути есть - в виде книг, где нет сюжетных дыр, всё логично, стройное повествование и достаточно взять и экранизировать оригинал как это было в первых фильмах с минимальным количеством отсебятины и зритель с восторгом примет любой такой фильм, однако вместо этого "Кольца власти" просто позаимствовали имена из оригинала, куски истории, мало связанные между собой и выдали очередной среднячковый сериал на один раз в лучшем случае.'
				),
				new Comment(
					'2',
					'default-user-id-2',
					'Default User 2',
					'female',
					'https://example.com/default-avatar-2.jpg',
					'Наверное, самая большая ошибка создателей сериала была в том, что они поставили уж слишком много надежд на поддержку фанатов вселенной. Как оказалось на деле, большинство "фанатов" с самой настоящей яростью и желчью стали уничтожать сериал, при этом объективности в отзывах самый минимум.'
				)
			);
			this.saveComments();
		}
	}

	private loadUser() {
		const user = localStorage.getItem('user');
		if (user) {
			this.currentUser = JSON.parse(user);
		} else {
			this.fetchRandomUser();
		}
	}

	private fetchRandomUser() {
		fetch('https://randomuser.me/api/')
			.then(response => response.json())
			.then(data => {
				const user = data.results[0];
				this.currentUser = {
					id: user.login.uuid,
					name: `${user.name.first} ${user.name.last}`,
					gender: user.gender,
					avatar: user.picture.medium
				};
				localStorage.setItem('user', JSON.stringify(this.currentUser));
				this.updateUserInfo();
			})
			.catch(error => console.error('Error fetching random user:', error));
	}

	private updateUserInfo() {
		const userAvatarElement = document.getElementById('user-avatar') as HTMLImageElement;
		const userNameElement = document.getElementById('user-name');
		const userGenderElement = document.getElementById('user-gender');
		if (userAvatarElement) userAvatarElement.src = this.currentUser.avatar;
		if (userNameElement) userNameElement.textContent = this.currentUser.name;
		if (userGenderElement) userGenderElement.textContent = this.currentUser.gender;
	}

	private initEventListeners() {
		document.getElementById('submit-comment')?.addEventListener('click', () => this.addComment());
		document.getElementById('comment-text')?.addEventListener('input', () => this.toggleSubmitButton());
		document.getElementById('toggle-comments')?.addEventListener('click', () => this.toggleComments());
		document.getElementById('sort-link')?.addEventListener('click', (event) => this.handleSortClick(event));
	}

	private toggleSubmitButton() {
		const textarea = document.getElementById('comment-text') as HTMLTextAreaElement;
		const submitButton = document.getElementById('submit-comment') as HTMLButtonElement;
		submitButton.disabled = textarea.value.length > 1000 || textarea.value.trim() === '';
	}

	private addComment() {
		const textarea = document.getElementById('comment-text') as HTMLTextAreaElement;
		const comment = new Comment(
			Date.now().toString(),
			this.currentUser.id,
			this.currentUser.name,
			this.currentUser.gender,
			this.currentUser.avatar,
			textarea.value.trim()
		);
		this.comments.push(comment);
		this.saveComments();
		this.renderComments();
		textarea.value = '';
		this.toggleSubmitButton();
	}

	private saveComments() {
		localStorage.setItem('comments', JSON.stringify(this.comments));
	}

	private renderComments() {
		const commentsContainer = document.getElementById('comments');
		if (commentsContainer) {
			commentsContainer.innerHTML = '';
			this.comments.forEach(comment => {
				const commentElement = this.createCommentElement(comment);
				commentsContainer.appendChild(commentElement);
			});
		}
	}

	private createCommentElement(comment: Comment) {
		const commentElement = document.createElement('div');
		commentElement.classList.add('comment');

		const userInfo = document.createElement('div');
		userInfo.classList.add('user-info');

		const userAvatar = document.createElement('img');
		userAvatar.src = comment.userAvatar;
		userAvatar.alt = 'User Avatar';
		userAvatar.classList.add('user-avatar');

		const userDetails = document.createElement('div');
		userDetails.classList.add('user-details');
		userDetails.innerHTML = `<span>${comment.userName}</span><span>${comment.userGender}</span>`;

		userInfo.appendChild(userAvatar);
		userInfo.appendChild(userDetails);

		const content = document.createElement('div');
		content.classList.add('content');
		content.textContent = comment.content;

		const actions = document.createElement('div');
		actions.classList.add('actions');

		const rating = document.createElement('div');
		rating.classList.add('rating');

		const upButton = document.createElement('button');
		upButton.textContent = '↑';
		upButton.addEventListener('click', () => this.rateComment(comment, 1));
		rating.appendChild(upButton);

		const ratingCount = document.createElement('span');
		ratingCount.textContent = comment.rating.toString();
		rating.appendChild(ratingCount);

		const downButton = document.createElement('button');
		downButton.textContent = '↓';
		downButton.addEventListener('click', () => this.rateComment(comment, -1));
		rating.appendChild(downButton);

		actions.appendChild(rating);

		const favoriteButton = document.createElement('button');
		favoriteButton.textContent = comment.isFavorite ? '★' : '☆';  // Set initial state
		favoriteButton.classList.add('favorite');
		if (comment.isFavorite) {
			favoriteButton.classList.add('active');
		}
		favoriteButton.addEventListener('click', () => this.toggleFavorite(comment));
		actions.appendChild(favoriteButton);

		commentElement.appendChild(userInfo);
		commentElement.appendChild(content);
		commentElement.appendChild(actions);

		return commentElement;
	}

	private rateComment(comment: Comment, value: number) {
		if (!this.userIdsRated.has(comment.id)) {
			comment.rating += value; // Ensure rating is a number
			this.userIdsRated.add(comment.id);
			this.saveComments();
			this.renderComments();
		}
	}

	private toggleFavorite(comment: Comment) {
		comment.isFavorite = !comment.isFavorite;
		this.saveComments();
		this.renderComments();
	}

	private sortComments(type: string) {
		switch (type) {
			case 'Дата':
				this.comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
				break;
			case 'Рейтинг':
				this.comments.sort((a, b) => b.rating - a.rating);
				break;
			case 'Ответы':
				this.comments.sort((a, b) => b.replies.length - a.replies.length);
				break;
		}
		this.renderComments();
	}

	private updateSortButton(type: string) {
		const sortLink = document.getElementById('sort-link') as HTMLAnchorElement;
		sortLink.textContent = type;
	}

	private handleSortClick(event: MouseEvent) {
		event.preventDefault();
		this.currentSortIndex = (this.currentSortIndex + 1) % this.sortOptions.length;
		const currentSortOption = this.sortOptions[this.currentSortIndex];
		this.sortComments(currentSortOption);
		this.updateSortButton(currentSortOption);
	}

	private toggleComments() {
		const commentsContainer = document.getElementById('comments');
		if (commentsContainer) {
			commentsContainer.classList.toggle('hidden');
		}
	}
}

new CommentSystem();