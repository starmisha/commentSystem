"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app"); // Adjust the import path as necessary
var CommentSystem = /** @class */ (function () {
    function CommentSystem() {
        this.comments = [];
        this.currentUser = { id: '', name: '', gender: '', avatar: '' };
        this.userIdsRated = new Set();
        this.sortOptions = ['Дата', 'Рейтинг', 'Ответы'];
        this.currentSortIndex = 0;
        this.loadComments();
        this.loadUser();
        this.initEventListeners();
    }
    CommentSystem.prototype.loadComments = function () {
        var comments = localStorage.getItem('comments');
        if (comments) {
            this.comments = JSON.parse(comments).map(function (comment) { return new app_1.Comment(comment.id, comment.userId, comment.userName, comment.userGender, comment.userAvatar, comment.content); });
        }
        else {
            // Add default comments
            this.comments.push(new app_1.Comment('1', 'default-user-id-1', 'Default User 1', 'male', 'https://example.com/default-avatar-1.jpg', 'Самое обидное, когда сценарий по сути есть - в виде книг, где нет сюжетных дыр, всё логично, стройное повествование и достаточно взять и экранизировать оригинал как это было в первых фильмах с минимальным количеством отсебятины и зритель с восторгом примет любой такой фильм, однако вместо этого "Кольца власти" просто позаимствовали имена из оригинала, куски истории, мало связанные между собой и выдали очередной среднячковый сериал на один раз в лучшем случае.'), new app_1.Comment('2', 'default-user-id-2', 'Default User 2', 'female', 'https://example.com/default-avatar-2.jpg', 'Наверное, самая большая ошибка создателей сериала была в том, что они поставили уж слишком много надежд на поддержку фанатов вселенной. Как оказалось на деле, большинство "фанатов" с самой настоящей яростью и желчью стали уничтожать сериал, при этом объективности в отзывах самый минимум.'));
            this.saveComments();
        }
    };
    CommentSystem.prototype.loadUser = function () {
        var user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
        else {
            this.fetchRandomUser();
        }
    };
    CommentSystem.prototype.fetchRandomUser = function () {
        var _this = this;
        fetch('https://randomuser.me/api/')
            .then(function (response) { return response.json(); })
            .then(function (data) {
            var user = data.results[0];
            _this.currentUser = {
                id: user.login.uuid,
                name: "".concat(user.name.first, " ").concat(user.name.last),
                gender: user.gender,
                avatar: user.picture.medium
            };
            localStorage.setItem('user', JSON.stringify(_this.currentUser));
            _this.updateUserInfo();
        })
            .catch(function (error) { return console.error('Error fetching random user:', error); });
    };
    CommentSystem.prototype.updateUserInfo = function () {
        var userAvatarElement = document.getElementById('user-avatar');
        var userNameElement = document.getElementById('user-name');
        var userGenderElement = document.getElementById('user-gender');
        if (userAvatarElement)
            userAvatarElement.src = this.currentUser.avatar;
        if (userNameElement)
            userNameElement.textContent = this.currentUser.name;
        if (userGenderElement)
            userGenderElement.textContent = this.currentUser.gender;
    };
    CommentSystem.prototype.initEventListeners = function () {
        var _this = this;
        var _a, _b, _c, _d;
        (_a = document.getElementById('submit-comment')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.addComment(); });
        (_b = document.getElementById('comment-text')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', function () { return _this.toggleSubmitButton(); });
        (_c = document.getElementById('toggle-comments')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return _this.toggleComments(); });
        (_d = document.getElementById('sort-link')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (event) { return _this.handleSortClick(event); });
    };
    CommentSystem.prototype.toggleSubmitButton = function () {
        var textarea = document.getElementById('comment-text');
        var submitButton = document.getElementById('submit-comment');
        submitButton.disabled = textarea.value.length > 1000 || textarea.value.trim() === '';
    };
    CommentSystem.prototype.addComment = function () {
        var textarea = document.getElementById('comment-text');
        var comment = new app_1.Comment(Date.now().toString(), this.currentUser.id, this.currentUser.name, this.currentUser.gender, this.currentUser.avatar, textarea.value.trim());
        this.comments.push(comment);
        this.saveComments();
        this.renderComments();
        textarea.value = '';
        this.toggleSubmitButton();
    };
    CommentSystem.prototype.saveComments = function () {
        localStorage.setItem('comments', JSON.stringify(this.comments));
    };
    CommentSystem.prototype.renderComments = function () {
        var _this = this;
        var commentsContainer = document.getElementById('comments');
        if (commentsContainer) {
            commentsContainer.innerHTML = '';
            this.comments.forEach(function (comment) {
                var commentElement = _this.createCommentElement(comment);
                commentsContainer.appendChild(commentElement);
            });
        }
    };
    CommentSystem.prototype.createCommentElement = function (comment) {
        var _this = this;
        var commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        var userInfo = document.createElement('div');
        userInfo.classList.add('user-info');
        var userAvatar = document.createElement('img');
        userAvatar.src = comment.userAvatar;
        userAvatar.alt = 'User Avatar';
        userAvatar.classList.add('user-avatar');
        var userDetails = document.createElement('div');
        userDetails.classList.add('user-details');
        userDetails.innerHTML = "<span>".concat(comment.userName, "</span><span>").concat(comment.userGender, "</span>");
        userInfo.appendChild(userAvatar);
        userInfo.appendChild(userDetails);
        var content = document.createElement('div');
        content.classList.add('content');
        content.textContent = comment.content;
        var actions = document.createElement('div');
        actions.classList.add('actions');
        var rating = document.createElement('div');
        rating.classList.add('rating');
        var upButton = document.createElement('button');
        upButton.textContent = '↑';
        upButton.addEventListener('click', function () { return _this.rateComment(comment, 1); });
        rating.appendChild(upButton);
        var ratingCount = document.createElement('span');
        ratingCount.textContent = comment.rating.toString();
        rating.appendChild(ratingCount);
        var downButton = document.createElement('button');
        downButton.textContent = '↓';
        downButton.addEventListener('click', function () { return _this.rateComment(comment, -1); });
        rating.appendChild(downButton);
        actions.appendChild(rating);
        var favoriteButton = document.createElement('button');
        favoriteButton.textContent = comment.isFavorite ? '★' : '☆'; // Set initial state
        favoriteButton.classList.add('favorite');
        if (comment.isFavorite) {
            favoriteButton.classList.add('active');
        }
        favoriteButton.addEventListener('click', function () { return _this.toggleFavorite(comment); });
        actions.appendChild(favoriteButton);
        commentElement.appendChild(userInfo);
        commentElement.appendChild(content);
        commentElement.appendChild(actions);
        return commentElement;
    };
    CommentSystem.prototype.rateComment = function (comment, value) {
        if (!this.userIdsRated.has(comment.id)) {
            comment.rating += value; // Ensure rating is a number
            this.userIdsRated.add(comment.id);
            this.saveComments();
            this.renderComments();
        }
    };
    CommentSystem.prototype.toggleFavorite = function (comment) {
        comment.isFavorite = !comment.isFavorite;
        this.saveComments();
        this.renderComments();
    };
    CommentSystem.prototype.sortComments = function (type) {
        switch (type) {
            case 'Дата':
                this.comments.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
                break;
            case 'Рейтинг':
                this.comments.sort(function (a, b) { return b.rating - a.rating; });
                break;
            case 'Ответы':
                this.comments.sort(function (a, b) { return b.replies.length - a.replies.length; });
                break;
        }
        this.renderComments();
    };
    CommentSystem.prototype.updateSortButton = function (type) {
        var sortLink = document.getElementById('sort-link');
        sortLink.textContent = type;
    };
    CommentSystem.prototype.handleSortClick = function (event) {
        event.preventDefault();
        this.currentSortIndex = (this.currentSortIndex + 1) % this.sortOptions.length;
        var currentSortOption = this.sortOptions[this.currentSortIndex];
        this.sortComments(currentSortOption);
        this.updateSortButton(currentSortOption);
    };
    CommentSystem.prototype.toggleComments = function () {
        var commentsContainer = document.getElementById('comments');
        if (commentsContainer) {
            commentsContainer.classList.toggle('hidden');
        }
    };
    return CommentSystem;
}());
new CommentSystem();
