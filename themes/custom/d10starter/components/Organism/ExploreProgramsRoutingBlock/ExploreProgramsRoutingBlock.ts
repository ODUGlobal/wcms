const setUpExploreProgramsRoutingBlock = () => {
  const select = document.getElementById('areas-of-study-select');
  if (!(select instanceof HTMLSelectElement)) return;

  /*
    I hate this, but selecting an option in this `<select>` element
    should trigger navigation to the corresponding page. Not good
    for accessibility, but we do at least include a visually-hidden
    note about this in the markup for the benefit of people using
    screen-readers.
  */
  select.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLSelectElement)) return;

    const value = event.target.value;
    if (!value) return;

    event.preventDefault();
    window.location.assign(value);
  });

  /*
    In Firefox (at least), when a `<select>` has focus, the right/left arrow-keys
    change which `<option>` is selected. Here, that would cause page-navigation,
    so we suppress it. I don't like messing with the browser's native controls
    like this, but I think in this case it's better than allowing accidental
    navigation.
  */
  select.addEventListener('keydown', (event) => {
    if (['Left', 'Right', 'ArrowLeft', 'ArrowRight'].includes(event.key))
      event.preventDefault();
  });
};

if (!window.IS_STORYBOOK) setUpExploreProgramsRoutingBlock();

export default setUpExploreProgramsRoutingBlock;
