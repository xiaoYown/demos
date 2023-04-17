import { JSX } from 'solid-js/jsx-runtime';
import Box from '@suid/material/Box';
import List from '@suid/material/List';
import ListItem from '@suid/material/ListItem';
import ListItemButton from '@suid/material/ListItemButton';
import ListItemText from '@suid/material/ListItemText';
import useTheme from '@suid/material/styles/useTheme';
import Drawer from '@suid/material/Drawer';
import Fab from '@suid/material/Fab';
import FormatListBulleted from '@suid/icons-material/FormatListBulleted';

import { createSignal } from 'solid-js';

function NavigationItemList(): JSX.Element {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton<'a'>
              component="a"
              href="#simple-list"
              target="none"
              onClick={event => event.preventDefault()}
            >
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}

function Navigation(): JSX.Element {
  const [getOpen, setOpen] = createSignal(false);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={getOpen()}
        sx={{ zIndex: 9999 }}
        onClose={() => toggleDrawer(false)}
      >
        <NavigationItemList />
      </Drawer>
      <div
        style={{
          display: getOpen() ? 'none' : 'block',
          position: 'fixed',
          'z-index': 10000,
          bottom: '10px',
          left: '10px',
        }}
      >
        <Fab size="small" aria-label="add">
          <FormatListBulleted
            color="primary"
            onClick={() => toggleDrawer(!getOpen())}
          />
        </Fab>
      </div>
    </>
  );
}

export default Navigation;
