import { BadRequestException, PipeTransform } from "@nestjs/common"
import { TaskStatus } from "../task.model"

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ]

  transform(value: any) {
    if (!this.isValid(value)) {
      throw new BadRequestException(`value "${value}" is not a valid status.`)
    }

    return value
  }

  private isValid(status: any) {
    return this.allowedStatus.includes(status)
  }
}
