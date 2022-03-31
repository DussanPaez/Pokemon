$( document ).ready(function() {
  function getFilters() {
    $.ajax({
      url: "https://pokeapi.co/api/v2/type"
    }).done(function(data) {
      renderFilters(data.results);
    });
  }

  function getPokemons() {
    $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon"
    }).done(function(data) {
      renderList(data.results);
    });
  }

  function renderFilters(filters) {
    const $filters = $('.filters__wrapper');
    for(let i = 0; i < filters.length; i++) {
      const $filter = $('<li class="filters__item" data-filter="'+ (i + 1) +'">'+ filters[i].name +'</li>');
      $filter.on('click', function () {
        getPokemonsByType($(this).attr('data-filter'));
      });
      $filters.append($filter);
    }
  }

  function getPokemonsByType(type) {
    console.log('click');
    $.ajax({
      url: "https://pokeapi.co/api/v2/type/" + type
    }).done(function(data) {
      renderList(data.pokemon);
    });
  }

  function getPokemonDetail(pokemon) {
    console.log('click');
    $.ajax({
      url: "https://pokeapi.co/api/v2/pokemon/" + pokemon
    }).done(function(data) {
      const $modal = $('#modal-pokemon');
      const $name = $modal.find('.name');
      $name.text(data.name);
      
      const $image = $modal.find('.image');
      let file = data.id;
      if (data.id > 8) {
        file = '0' + data.id;
      } else if (data.id > 98) {
        file = data.id;
      } else {
        file = '00' + data.id;
      }
      $image.attr('src', 'images/' + file +'.png');

      const $height = $modal.find('.height');
      $height.append(data.height);

      const $weight = $modal.find('.weight');
      $weight.append(data.weight);

      const $stats = $modal.find('.stats');
      for (let i = 0; i < data.stats.length; i++) {
        $stats.append('<p class="item">'+ data.stats[i].stat.name +' '+ data.stats[i].base_stat +'</p>');
      }

      const $types = $modal.find('.types');
      for (let i = 0; i < data.types.length; i++) {
        $types.append('<p class="item">'+ data.types[i].type.name +'</p>');
      }

      const $abilities = $modal.find('.abilities');
      for (let i = 0; i < data.abilities.length; i++) {
        $abilities.append('<p class="item">'+ data.abilities[i].ability.name +'</p>');
      }
      
      $modal.modal();
    });
  }

  function renderList(pokemons) {
    const $list = $('.list__wrapper');
    $list.html('');
    for(let i = 0; i < pokemons.length; i++) {
      const $pokemon = $('<article class="list__item"></article>');

      const name = pokemons[i].pokemon ? pokemons[i].pokemon.name : pokemons[i].name;
      const url = pokemons[i].pokemon ? pokemons[i].pokemon.url : pokemons[i].url;
      let paramUrl = url.indexOf('pokemon/');
      paramUrl = url.substring(paramUrl + 7);
      let image = paramUrl.replace(/\D/g,'');
      if (i > 8) {
        image = '0' + image;
      } else if (i > 98) {
        image = image;
      } else {
        image = '00' + image;
      }

      $pokemon.append('<figure class="list__item__thumbnail"><img src="images/'+ image +'.png" alt="'+ name +'"></figure>');
      $pokemon.append('<h2 class="list__item__title">'+ name +'</h2>');
      $pokemon.on('click', function () {
        getPokemonDetail(name);
      });
      $list.append($pokemon);
    }
  }

  getFilters();
  getPokemons();
});
