import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorMessage } from "@/components/ui";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Top-level error boundary so a single component crash doesn't blank the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg p-6">
          <ErrorMessage
            title="Something went wrong"
            message="An unexpected error occurred. Try reloading the page."
            onRetry={this.handleRetry}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
