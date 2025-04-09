// This file is no longer needed as we're using real timestamps
export class LamportClock {
  private timestamp: number = 0;

  increment(): number {
    return Date.now(); // Return current timestamp instead of logical clock
  }

  update(receivedTimestamp: number): number {
    return Date.now(); // Return current timestamp instead of logical clock
  }

  getTime(): number {
    return Date.now(); // Return current timestamp instead of logical clock
  }
}