import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EmailScheduleDto } from './dto/email-schedule.dto';
import { EmailService } from './email.service';

@Injectable()
export default class EmailScheduleService {
  constructor(
    private readonly _emailService: EmailService,
    private readonly _scheduleRegistry: SchedulerRegistry
  ) {}

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this._emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content
      });
    });

    this._scheduleRegistry.addCronJob(`${Date.now()} - ${emailSchedule.subject}`, job);
    job.start();
  }
}
