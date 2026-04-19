# Goal

Add features to the UI to cover all API capabilities.

# Features

## Automatic mode - status page

When in automatic mode, our display will depend on current situation.
If there is a sequence in progress, we will display the status of the sequence.
* which relay is currently opened, how long until it closes.
* all the next squences to come and their planned start time and duration.

If there is no sequence in progress, we will display the next sequence and its planned day and start time.
If there is no sequence to come, we will display a message to say that there is no sequence to come.

## Semi-automatic mode - status page

When in semi-automatic mode, our display will depend on current situation.
If there is a sequence in progress, we will display the status of the sequence.
* which relay is currently opened, how long until it closes.
* all the next squences to come and their planned start time and duration.
If there is no sequence in progress, we will display a button to start the sequence.

## Manual mode - status page

When in manual mode, we should display a button for each relay to open or close.
Button will also display the current status of the relay.

## Settings page

Settings page should be able to display all settings related to the automatic and semi-automatic modes.
* Days of the week that the sequence will run in auto mode.
* Start time of the sequence in auto mode.
* relays durations.