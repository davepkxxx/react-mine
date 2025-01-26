export class Timer {
  private running = false
  private startAt: Date | null = null

  get isRunning() {
    return this.running
  }

  get sec() {
    return this.startAt
      ? (new Date().getTime() - this.startAt.getTime()) / 1000
      : 0
  }

  start() {
    this.running = true
    this.startAt = new Date()
    return this.startAt
  }

  pause() {
    this.running = false
  }

  stop() {
    this.running = false
    this.startAt = null
  }
}
