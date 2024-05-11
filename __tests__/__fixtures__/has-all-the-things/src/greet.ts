export interface Greetable {
  name: string
}

export function greet(greetable: Greetable) {
  return `Hello, ${greetable.name}!`
}
