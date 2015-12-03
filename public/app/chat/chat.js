
var ChatModule = (function() {
  var config = {
    margin: 5,
    width: 250 + 5
  };

  var $body = $('body');
  var chats = [];
  var otherUsers = [];
  var subscriptions;
  var currentUser;

  var listen = function() {
    var userRef = new Firebase('https://dvelop-carbon.firebaseio.com/users/');

    subscriptions = [];

    userRef.once('value', function(user) {
      user.forEach(function(data) {
        var otherUser = data.val().displayName;

        if (otherUser && currentUser !== otherUser) {
          otherUser = otherUser.replace(/[.]/g, '');
          var path = currentUser < otherUser ? currentUser + '-' + otherUser  : otherUser + '-' + currentUser;
          var ref = new Firebase('https://dvelop-carbon.firebaseio.com/messages/' + path);
          var displayed = false;
          var calledOnce = false;

          subscriptions.push(ref);

          ref.on('value', function(data) {
            if (!displayed && calledOnce) {
              ChatModule.create(otherUser);
              displayed = true;
            }

            if (!calledOnce) calledOnce = true;
          });
        }
      });
    });
  };

  var Chat = function(currentUser, otherUser) {
    this.currentUser = currentUser;
    this.otherUser = otherUser;

    this.path = currentUser < otherUser ? currentUser + '-' + otherUser  : otherUser + '-' + currentUser;
    this.messagesRef = new Firebase('https://dvelop-carbon.firebaseio.com/messages/' + this.path);

    this.$chat = null;
    this.$content = null;

    this.messages = {};
    this.displayedMessages = {};

    this.init();
  };

  Chat.prototype.init = function() {
    this.renderChat();
    this.$content.scrollTop(this.$content.prop('scrollHeight'));

    this.messagesRef.on('value', function(data) {
      this.messages = data.val();
      this.renderMessages();
    }.bind(this));

  };

  Chat.prototype.renderChat = function() {
    var chatTemplate = 
      '<div class="chat-box">' +
        '<input type="checkbox" />' +
        '<label data-expanded="$otherUser" data-collapsed="$otherUser" />' +
        '<div class="chat-box-content"></div>' +
        '<div class="chat-input-container"></div>' + 
          '<img class="chat-icon" src="assets/chat-20.png">' +
          '<input type="text" class="chat-box-input">' + 
        '</div>' +
      '</div>';

    this.$chat = $(chatTemplate.replace(/\$otherUser/g, this.otherUser));
    this.$chat.attr('id', this.path);
    this.$chat.css('right', chats.length * config.width + config.margin + 'px');
    this.$chat.find('.chat-box-input').on('keydown', function(event) {
      if (event.keyCode === 13) {
        this.messagesRef.push({ 
          text: event.target.value, 
          user: this.currentUser,
          createdAt: Firebase.ServerValue.TIMESTAMP 
        });
        event.target.value = '';
      }
    }.bind(this));

    this.$content = this.$chat.find('.chat-box-content');

    $body.append(this.$chat);

  };

  Chat.prototype.renderMessages = function() {
    for (var key in this.messages) {
      if (!(key in this.displayedMessages)) {
        this.$content.append(this.renderMessage(this.messages[key].user, this.messages[key].text));
        this.displayedMessages[key] = true;
      }
    }

    this.$content.scrollTop(this.$content.prop('scrollHeight'));
  };

  Chat.prototype.renderMessage = function(user, text) {
    var messageTemplate = '<div class="chat-message">$user: $text</div>';
    return $(messageTemplate.replace(/\$user/g, user).replace(/\$text/g, text));
  };

  return {
    create: function(otherUser) {
      if (otherUsers.indexOf(otherUser) === -1) {
        chats.push(new Chat(currentUser, otherUser));
        otherUsers.push(otherUser);
      }
    },
    setUser: function(user) {
      currentUser = user;
      listen();
    }
  };
})();

// ChatModule.setUser('Michael Kim');
