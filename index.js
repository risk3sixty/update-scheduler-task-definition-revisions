const core = require("@actions/core");
const {
  SchedulerClient,
  ListSchedulesCommand,
  GetScheduleCommand,
  UpdateScheduleCommand,
  //   ListTasksCommand,
  //   ExecuteCommandCommand,
} = require("@aws-sdk/client-scheduler");

(async () => {
  try {
    // inputs defined in action.yml
    const region = core.getInput('region')
    const groupName = core.getInput('group_name')
    const newTaskDefinitionArn = core.getInput('new_task_definition_arn')
    const scheduler = new SchedulerClient({ region });

    console.log(`Getting schedules in the group ${groupName}.`);
    const { Schedules: schedules } = await scheduler.send(
      new ListSchedulesCommand({ GroupName: groupName })
    );

    await Promise.all(
      schedules.map(async (schedule) => {
        const scheduleDetails = await scheduler.send(
          new GetScheduleCommand(schedule)
        );

        delete scheduleDetails["$metadata"];

        const updatedSchedule = {
          ...scheduleDetails,
          Target: {
            ...scheduleDetails.Target,
            EcsParameters: {
              ...scheduleDetails.Target.EcsParameters,
              TaskDefinitionArn: newTaskDefinitionArn,
            },
          },
        };
        const updateOutput = await scheduler.send(
          new UpdateScheduleCommand(updatedSchedule)
        );

        if(updateOutput?.ScheduleArn && updateOutput.$metadata.httpStatusCode === 200) {
            console.log(`Schedule updated successfully for ${scheduleDetails.Name}`);
        } else {
            core.setFailed(`Failed to update schedule for ${scheduleDetails.ScheduleName}. Update response: ${updateOutput}`);
        }
      })
    );
    console.log('Update complete');
  } catch (err) {
    core.setFailed(err.message);
  }
})();
