"use client";

import { Component, type ReactNode } from "react";

/** Keeps a failure inside the 3D view (driver, memory, blocked decoder) from taking the page down. */
export class StudioErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D studio unavailable:", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
