import { screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Router from 'next/router';
import MyProfileScreen from '../../pages/admin/profile';
import MockApp from '../core/App.Mock';

// FIXME: test JWT token

jest.mock('next/router', () => ({
  push: jest.fn(),
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { map: 'Ascent32' },
      asPath: '',
    };
  },
}));

jest.mock(
  'next/link',
  () =>
    function LinkComponent({ children }: any) {
      return children;
    },
);

const handlers = [
  rest.get(`http://localhost/user`, async (req, res, ctx) =>
    res(
      ctx.json({
        id: 'idUsername',
        username: 'usernameUsername',
        image: 'imageUsername',
      }),
    ),
  ),
];

const server = setupServer(...handlers);

describe('<MyProfileScreen />', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render profile screen', async () => {
    render(<MyProfileScreen />);

    await waitForElementToBeRemoved(screen.getByTestId(/loader/i), {
      timeout: 2000,
    });

    const inputUsername: HTMLInputElement = screen.getByLabelText('Trocar nome de usuário');
    expect(inputUsername.value).toEqual('usernameUsername');
  });

  it('should logout screen', async () => {
    render(
      <MockApp>
        <MyProfileScreen />
      </MockApp>,
    );

    await waitForElementToBeRemoved(screen.getByTestId(/loader/i), {
      timeout: 2000,
    });

    userEvent.click(screen.getByRole('button', { name: 'logoff' }));

    expect(Router.push).toHaveBeenCalledWith('/login');
    Router.push('');
  });

  it('should edit user and save', async () => {
    render(
      <MockApp>
        <MyProfileScreen />
      </MockApp>,
    );

    await waitForElementToBeRemoved(screen.getByTestId(/loader/i), {
      timeout: 2000,
    });

    userEvent.type(screen.getByLabelText('Trocar nome de usuário'), 'newUsername');
    userEvent.type(screen.getByLabelText('Digite uma nova senha'), 'newPassword');
    userEvent.type(screen.getByLabelText('Confirme a nova senha'), 'newPassword');

    userEvent.click(screen.getByRole('button', { name: 'Atualizar dados' }));

    // FIXME: create feature
  });
});
