# Update Scheduler Task Definitions with NodeJS

GitHub Action that updates all schedules within a Schedule Group with the provided task definition ARN

## Inputs

## `region`

**Required** Region the schedule-group is in.

## `group_name`

**Required** The name of the Schedule Group to update.

## `new_task_definition_arn`

**Required** The task definition to update the schedules

## `exceptions`

**Optional** Names of any schedules to exclude from the update

## Outputs


## Example usage

```
uses: ris3sixty/update-scheduler-task-definition-revisions@v1.0
with:
	region: 'us-east-1'
	group_name: 'Schedule-Group-Name'
	new_task_definition_arn: 'arn:aws:ecs:us-east-1:XXXX:task-definition/qa-web:2'
	exceptions: ['schedule1', 'schedule2']