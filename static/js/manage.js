"use strict";

//--------------------------------------------------------------------//
// *** Item Management Functions                                      //
//--------------------------------------------------------------------//

//* When user clicks on a cover, open up the view_item part of the page
//    allow user to add item to a collection

console.log('hello from manage.js');

// add event listener to add event listeners to buttons in table after it's rendered!
$('.nav-link').on('click', ()=> {
  console.log("ok, now you can click those buttons in the table -__-");

  $('button.user-media-id').on('click', (evt) => {
      console.log('helloooooo');
      $('#collection-details').html(''); // reset collection details popout
      $.post('/view_item', {'user_media_id': evt.target.id}, (res) => {
          $('#item-details').html(res);
          window.scrollTo(0,$('#item-details').offset().top);
          console.log('item details have successfully been displayed on this page');
  
          //* When user clicks delete item button, remove association between 
          //    item and user (UserMedia object)

          $('#delete-from-library').on('click', () => {
            const id_to_del = $('#delete-from-library').val();
            console.log(`here's your value: "${id_to_del}"`);
            console.log($(`.${id_to_del}`)[0].id); 
            // NTH: pop up confirmation before actually deleting
            $.post('/delete_item', {'user_media_id': id_to_del}, (res) => {
                $('#item-details').html('');
                alert(res);
                $(`.${id_to_del}`).remove(); 
            }); 
          })

          $('#add-to-collection').on('click', (evt) => {
              evt.preventDefault();
              $.get('/list_collections', (userCollections) => {
              
                  $('#which-collection-to-add-to')
                      .append('<form id="add-to-collection-form">');
                  for (let i in userCollections) {
                      $('#which-collection-to-add-to')
                      .append(
                        `<p>
                          <input type="radio" name="which-collection" value="${i}">
                          ${userCollections[i]['name']}
                        </p>`
                        );
                  }
                  $('#which-collection-to-add-to')
                      .append('<input type="submit" id="coll-submit-button"></form>');
                  
                  $('#coll-submit-button').on('click', () => {
                      const user_media_id = $('#add-to-collection').val();
                      const collection_id = $('input[type="radio"]:checked').val();
                      const postData = {'user_item_id': user_media_id, 
                                      'collection_id': collection_id}
                      $.post('/add_item_to_collection', postData, (res2) => {
                          alert(res2['alert']);
                          $(`#collection-display-${collection_id}`).append(
                              `<img src="${res2['cover']}" class="${user_media_id}">`);
                      });
                      $('#which-collection-to-add-to').html('');
                  });
              });

          });
      });
  });

}) // closes test event listener
//// When user clicks "Edit Details" button, 
////    open up form entry for anything with class '.editable-detail'
////    and AUTOFILL using $('.editable-detail') 

//// $('#edit-details').on('click', () => {
////     const id_to_edit = $('#edit-details').val();
////     $.get('/edit_item', 
////     {'user_media_id': id_to_edit}, 
////     () => {
////         console.log('success...?'); // redirect?!
////     })

//     // open up form entry for anything with class '.editable-detail' ... $('.editable-detail') ... then use new route called update?
//     // OR... redirect to review_item page and AUTOFILL using $('.editable-detail') stuff and add a conditional to the add_item route to update instead
//// })


//--------------------------------------------------------------------//
// *** Collection Management Functions                                //
//--------------------------------------------------------------------//

//* When user clicks on a collections div, 
//    open up the view_collection part of the page

$('.collection').on('click', (evt) => {
    // evt.preventDefault();
    // alert(`WHY HELLO THERE... my id is ${evt.target.id}`);
    $('#item-details').html('');
    $.post('/view_collection', {'collection_id': evt.target.id}, (res) => {
        $('#collection-details').html(res);
        window.scrollTo(0,$('#collection-details').offset().top);
        console.log('collection details have successfully been displayed on the page');

    //* When user clicks delete collection button, delete collection

    $('#delete-collection').on('click', () => {
      const id_to_del = $('#delete-collection').val();
      console.log(`here's your value: "${id_to_del}"`); // 
      // NTH: pop up confirmation before actually deleting
      $.post('/delete_collection', {'collection_id': id_to_del}, (res) => {
          $('#collection-details').html('');
          $(`#collection-display-${id_to_del}`).remove();
          alert(res);
      }); 
    });
    });

    // TODO: When user clicks "Make Collection Public/Private" button, toggle public status of that collection.
    // TODO: When user clicks "Rename Collection" button, ask for new name and then update that collection's record
})


//* When user clicks on "Add New Collection" button, 
//    ask for a name and then make collection

$('#create-collection').on('click', () => {
    $('#new-collection').html(
      `<div class="container popout col-3"><div class="container"><form id="new-collection-form">
        <p>New collection name: 
          <input type="text" id="new-collection-name">
        </p>
        <p>
          <input type="radio" name="new-collection-public-status" 
            value="true" id="new-collection-public-true" required> 
          Public
        </p>
        <p>
          <input type="radio" name="new-collection-public-status" 
            value="" id="new-collection-public-false" required> 
          Private
        </p>
        <input type="submit" id="submit-new-collection">
      </form></div></div>`
      );

    $('#new-collection-form').on('submit', (evt) => {
        evt.preventDefault();
        const collection_name = $('#new-collection-name').val();
        const public_bool = $('input[type="radio"]:checked').val();
        console.log(`The collection ${collection_name} is being created...`);
        $.post('/create_collection', 
               {'collection_name': collection_name, 'public': public_bool}, 
               (res) => {
          alert(res['alert']);
          if (public_bool === '') {
            $(`#collections-display`).append(
              `<div class="container col" id="collection-display-${res['collection_id']}">
              <div class="container">
                <h5>${collection_name} (private)</h5>
              </div>
              <p>
              <button type="button" class="btn btn-primary collection" 
              id="${res['collection_id']}" value="${res['collection_id']}">
                view details
              </button>
              </p>
            </div>`);  
          } else {
            $(`#collections-display`).append(
              `<div class="container col" id="collection-display-${res['collection_id']}">
              <div class="container">
                <h5>${collection_name}</h5>
              </div>
              <p>
              <button type="button" class="btn btn-primary collection" 
              id="${res['collection_id']}" value="${res['collection_id']}">
                view details
              </button>
              </p>
            </div>`);
          }
          console.log('collection has successfully been added.');
        })
        $('#new-collection').html('');
    })
})


// $('#testing').on('click', () => {
//   const id_to_del = $('#delete-collection').val();
//   console.log(`here's your value: "${id_to_del}"`); // 
  // NTH: pop up confirmation before actually deleting
  // $.post('/delete_collection', {'collection_id': id_to_del}, (res) => {
  //     $('#collection-details').html('');
  //     $(`#collection-display-${id_to_del}`).remove();
  //     alert(res);
  // });
// });