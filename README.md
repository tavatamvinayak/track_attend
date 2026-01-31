1. Employee Side (Mobile App)
   - Login (employee ID / phone / email)
   - Check-in button:
     → Captures timestamp + precise GPS location
     → Starts continuous background location tracking
   - Check-out button:
     → Captures timestamp + final GPS location
     → Stops location tracking & background service
   - Auto status: shows whether currently "On Duty" or "Off Duty"
   - History of own check-in/check-out records (date, time, location)

2. Admin Side (Web + Mobile Dashboard)
   - Real-time overview widget: "X / Y employees currently checked-in"
   - Filterable employee list with status:
     • Checked-in (green) → shows last location timestamp
     • Checked-out (gray)
     • Not started today (yellow)
   - Click on checked-in employee → shows live location on interactive map
   - Multi-select employees → show multiple live locations simultaneously
   - Real-time notifications panel / push notifications:
     • "[Employee Name] just checked-in at [time]"
     • "[Employee Name] just checked-out at [time]"
     • (Optional) Long stay alert / out-of-zone alert



## web  :- Track Attend for website
```
cd trackattend_web

npm install

npm run dev
```

## App  :- Track Attend for Application
```
cd trackattend

npm install

npm run android
```
