$(document).ready(function() {

  // Hiding the received messages by default when loading the user's page

  $('#received-messages').fadeOut('fast');

  // Showing or hiding the received messages on the messages page

  $('#show-messages-button').on('click', function() {
    $('.previous-message').fadeToggle('fast');
  });

  // Showing or hiding the received messages on the user's page

  $('#show-messages-button').on('click', function() {
    $('#received-messages').fadeToggle('fast');
  });

  // Showing or hiding the user's favourites on the user's page

  $('#show-favorites-button').on('click', function() {
    $('#favorites-container').fadeToggle('fast');
    $('#favorites-filter-button').fadeToggle('fast');
  });

  // Adding to favourites on clicking the add to favourites icon

  $('.add-favorite-form').on('submit', function(event) {
    event.preventDefault();
    const icon = $(event.target).find('.button-favorite i');
    $(icon).removeClass("far fa-heart").addClass("fas fa-heart");
    // $(event.target).toggleClass("fas fa-heart far fa-heart");

    const currentListing = $(event.target).closest('.one-listing');
    const listingId = $(currentListing).attr("id");

    $.ajax({
      url: `/favorites/add_favorite/${listingId}`,
      method: 'POST',
    })
  });

  // Removing from favourites on clicking the remove from favourites icon

  $('.remove-favorite-form').on('submit', function(event) {
    event.preventDefault();
    const icon = $(event.target).find('.button-favorite i');
    $(icon).removeClass("fas fa-heart").addClass("far fa-heart");
    // $(event.target).toggleClass("fas fa-heart far fa-heart");

    const currentListing = $(event.target).closest('.one-listing');
    const listingId = $(currentListing).attr("id");

    $.ajax({
      url: `/favorites/remove_favorite/${listingId}`,
      method: 'POST',
    })
      // .then(() => $(currentListing).fadeOut('fast'));
      // .then($('#favorites-listings').empty())
      // .then(loadFavorites)
  });

  // Showing an alert when a message is sent

  $('#new-message-button').on('click', function() {
    alert('Your message has been sent!');
  });

  // Checking and showing an error if the fields are empty when submitting forms on add or edit listing pages

  $('form').on('submit', function(event) {

    event.preventDefault();

    let tweetText = $('#tweet-text').val();

    if (tweetText.length > 140) {
      $('.error').slideUp('fast');
      $('.error').html('The tweet exceeds the maximum length');
      $('.error').slideDown('fast');
    } else if (!tweetText) {
      $('.error').slideUp('fast');
      $('.error').html('Please enter the tweet');
      $('.error').slideDown('fast');
    } else {
      $('.error').slideUp('fast');
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $(this).serialize(),
      })
        .then($('#tweets-container').empty())
        .then($('#tweet-text').val(""))
        .then($('output').val(140))
        .then(loadTweets);
    }

  });

})
