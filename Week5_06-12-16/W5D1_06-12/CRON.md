# CRON Jobs And Scheduling

*CRON job* is a task scheduled to run automatically at a fixed time, date, or interval,without any manual intervention — named after the 
cron daemon in Unix systems.Backend applications use scheduled jobs for tasks such as sending daily digest emails,cleaning up expired sessions/tokens, generating nightly reports, or syncing data with a
third-party service.

# CRON vs normal function
Function = what to do
Scheduler = when to do it

A normal function doesnot runs automatically , something must call it. But Scheduler is a function which checks the clock and if schedule match it call the function itself.


# Why do we use `node-cron`
simple setInterval works on simple repeating delay whereas node-crom works for calander/time based scheduling.

# CRON Fields : Read it from left to right:
'*' A cron schedule is expressed with five fields : '*'

* * * * *
│ │ │ │ │
│ │ │ │ └── Day of week
│ │ │ └──── Month
│ │ └────── Day of month
│ └──────── Hour
└────────── Minute

'*' some systems support a sixth "seconds" field : '*'
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └── Day of week (0 - 6) (0/7=Sunday)
│ │ │ │ └──── Month (1 - 12)
│ │ │ └────── Day of month (1 - 31)
│ │ └──────── Hour (0 - 23)
│ └────────── Minute (0 - 59)
└──────────── Second (0 - 59)

* *NOTE* : some of the framework(like AWS EventBridge or Quartz) the sixth field as year placing it to the end instead of keeping in start as a second. Always check specific framework's doumentation.


1. *5-Field Syntax* (Infrastructure & System Level): Standard for Linux server crontab, Kubernetes CronJobs, standard Airflow DAG schedules, and traditional DevOps scripts.

2. *6-Field Syntax* (Application & Microservice Level): Standard inside application code where jobs require second-level accuracy (e.g., polling an internal queue every 30 seconds or triggering high-frequency financial batch processes).

* '*' basically means every possible value in this field. 
***** means every minutes
0**** means every hour at 0 minute
00*** every day at midnight
000** every first day of each month 
00**0 every sunday at midnight
*No negative values allowed in any field*

*/15 **** represents every 15 minutes 
here */15 represent every 15 values 

*Note* Normally cron engine use Gregorian (English) calendar and do not support Bikram Sambat (BS or Nepali Calander), so we use a nepali day conversion library inside the job to solve this.
`npm install nepali-date-converter `

# Important 
cron doesnot execue database operation 
Here Scheduler answers When and Application Logic answers What ?


Node application starts
        ↓
Scheduler is registered
        ↓
Node process stays running
        ↓
Clock keeps being checked
        ↓
Schedule matches
        ↓
Callback executes

A scheduled job inside your Node process requires that process to be running.
If your application is completely stopped, its in-process scheduler isn't executing.

That's one reason production systems sometimes use external job schedulers, queues, workers, operating-system cron, or cloud scheduling services.

