
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
          var calledOnce = false;

          subscriptions.push(ref);

          ref.on('value', function(data) {
            if (otherUsers.indexOf(otherUser) === -1 && calledOnce) {
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
    this.lastMessageUser = '';
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
        '<span class="chat-close">X</span>' +
        '<span class="chat-min">_</span>' +
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
    this.$chat.css('right', otherUsers.length * config.width + config.margin + 'px');
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

    this.$chat.find('.chat-min').on('click', function() {
      this.$chat.find('input:checkbox').trigger('click');
    }.bind(this));

    this.$chat.find('.chat-close').on('click', function() {
      this.$chat.remove();
      otherUsers.splice(otherUsers.indexOf(this.otherUser), 1);
    }.bind(this));

    this.$content = this.$chat.find('.chat-box-content');

    $body.append(this.$chat);

  };

  Chat.prototype.renderMessages = function() {
    for (var key in this.messages) {
      if (!(key in this.displayedMessages)) {
        var user = this.messages[key].user;

        if (this.lastMessageUser !== user)
          this.$content.append(this.renderUser(user));

        this.$content.append(this.renderMessage(this.messages[key].text));
        this.displayedMessages[key] = true;
      }
    }

    this.$content.scrollTop(this.$content.prop('scrollHeight'));
  };

  Chat.prototype.renderUser = function(user) {
    var userTemplate = '$hr<div class="chat-user"><b>$user</div>';
    var hr = this.lastMessageUser === '' ? '' : '<hr>';
    this.lastMessageUser = user;
    console.log(userTemplate.replace(/\$user/g, user));
    return userTemplate.replace(/\$user/g, user).replace(/\$hr/g, hr);

  };

  Chat.prototype.renderMessage = function(text) {
    var messageTemplate = '<div class="chat-message">$text</div>';
    return $(messageTemplate.replace(/\$text/g, text));
  };

  return {
    create: function(otherUser) {
      otherUser = otherUser.replace(/[.]/g, '');
      if (otherUsers.indexOf(otherUser) === -1) {
        new Chat(currentUser, otherUser);
        otherUsers.push(otherUser);
      }
    },
    setUser: function(user) {
      currentUser = user.replace(/[.]/g, '');
      listen();
    }
  };
})();
