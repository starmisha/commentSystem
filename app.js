"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
var Comment = /** @class */ (function () {
    function Comment(id, userId, userName, userGender, userAvatar, content) {
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
    Comment.prototype.toggleFavorite = function () {
        this.isFavorite = !this.isFavorite;
    };
    Comment.prototype.rateUp = function () {
        this.rating = Math.min(this.rating + 1, 5); // Ensure rating does not exceed 5
    };
    Comment.prototype.rateDown = function () {
        this.rating = Math.max(this.rating - 1, 0); // Ensure rating does not go below 0
    };
    Comment.prototype.addReply = function (reply) {
        this.replies.push(reply);
    };
    Comment.prototype.formatDate = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };
    Comment.prototype.getFormattedDate = function () {
        return this.formatDate(this.date);
    };
    return Comment;
}());
exports.Comment = Comment;
