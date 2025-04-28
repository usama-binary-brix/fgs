'use client'
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
import { PageTitle } from './PageTitle';

interface NotificationItem {
  id: string;
  message: string;
  time: string;
}

interface NotificationGroup {
  title: string;
  items: NotificationItem[];
}

const Notifications = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Notification data
  const notificationGroups: NotificationGroup[] = [
    {
      title: 'Today',
      items: [
        { id: 't1', message: 'New Investor Request to approve for Inventory I00045', time: 'Just now' },
        { id: 't2', message: 'Need Action for Inventory I00123', time: '7 min ago' },
        { id: 't3', message: 'Tasks Completed for Inventory I00125, moved on to next stage', time: '1h ago' },
        { id: 't4', message: 'New Inventory Added', time: '5h ago' }
      ]
    },
    {
      title: '17 Apr, 2025',
      items: [
        { id: 'd1', message: 'New Investor Request to approve for Inventory I00045', time: '18h ago' },
        { id: 'd2', message: 'Need Action for Inventory I00123', time: '23h ago' },
        { id: 'd3', message: 'Tasks Completed for Inventory I00125, moved on to next stage', time: '1 day ago' },
        { id: 'd4', message: 'New Inventory Added', time: '1 day ago' }
      ]
    }
  ];

  // Filtered notifications
  const unreadNotifications: NotificationGroup[] = [];

  return (
    <>

      <PageTitle title="Notifications" />


      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>


        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          aria-label="notification tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#D18428',
            },
          }}
        >
          <Tab
            label="All"
            sx={{
              fontWeight: 600,
              fontSize: '16px',

              color: tabValue === 0 ? '#D18428' : 'inherit',
              '&.Mui-selected': {

                color: '#D18428',
              },
            }}
          />
          <Tab
            label="Unread"
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              color: tabValue === 1 ? '#D18428' : 'inherit',
              '&.Mui-selected': {
                color: '#D18428',
              },
            }}
          />
        </Tabs>

        {/* Tab Panels */}
        <Box mt={3}>
          {/* All Notifications */}
          {tabValue === 0 && (
            <>
              {notificationGroups.map((group) => (
                <Paper
                  key={group.title}
                  elevation={0}
                  sx={{
                    backgroundColor: 'white',
                    mb: 3,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box p={2} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="h6" fontWeight="semibold">
                      {group.title}
                    </Typography>
                  </Box>
                  <List>
                    {group.items.map((item) => (
                      <ListItem
                        key={item.id}
                        divider
                        sx={{
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <ListItemText
                          primary={item.message}
                          secondary={item.time}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <IoIosArrowForward />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </>
          )}

          {/* Unread Notifications */}
          {tabValue === 1 && (
            <>
              {unreadNotifications.map((group) => (
                <Paper
                  key={group.title}
                  elevation={0}
                  sx={{
                    backgroundColor: 'white',
                    mb: 3,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box p={2} sx={{ borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="h6" fontWeight="semibold">
                      {group.title}
                    </Typography>
                  </Box>
                  <List>
                    {group.items.map((item) => (
                      <ListItem
                        key={item.id}
                        divider
                        sx={{
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <ListItemText
                          primary={item.message}
                          secondary={item.time}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <IoIosArrowForward />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ))}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Notifications;