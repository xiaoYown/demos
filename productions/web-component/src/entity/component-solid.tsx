import { customElement } from 'solid-element';

const TextReverseSolid = (props, { element }) => {
  console.log(props)
  console.log(element)
  return <span>kkkk</span>
  // ... Solid code
}

customElement('text-reverse-solid', {someProp: 'one', otherProp: 'two'}, TextReverseSolid)
