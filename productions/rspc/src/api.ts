import { createClient, FetchTransport } from '@rspc/client';
import type { Procedures } from '@demo-server/rspc'; // These were the bindings exported from your Rust code!

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
  // Refer to the integration your using for the correct transport.
  transport: new FetchTransport('http://localhost:4000/rspc', (input, init) => {
    const myHeaders = new Headers();
    myHeaders.append('xxx-Content-Type', 'text/xml');

    return window.fetch(input, {
      ...init,
      // credentials: 'include',
      headers: myHeaders,
    });
  }),
});

// Now use the client in your code!
export const fetchGetData = async (): Promise<{
  version: string;
  userTwo: string;
}> => {
  const version = await client.query(['version']); // The types will be inferred from your backend.
  const userTwo = await client.mutation(['sendMsg', 'Your message']);
  await client.mutation(['create_user', { id: 'userId', username: 'myname' }]);

  return { version, userTwo };
};
