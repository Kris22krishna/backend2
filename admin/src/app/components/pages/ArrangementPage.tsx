import { Grid3x3, Shuffle } from "lucide-react";
import { Button } from "../ui/button";

export function ArrangementPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <Grid3x3 className="size-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Question Arrangement
        </h2>
        <p className="text-gray-600 mb-6">
          Organize and arrange questions for quizzes with drag-and-drop
        </p>
        <Button className="gap-2" size="lg">
          <Shuffle className="size-5" />
          Start Arranging
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Auto-Arrange by Difficulty
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Automatically sort questions from easy to hard
            </p>
            <Button variant="outline" size="sm">
              Auto-Arrange
            </Button>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              Random Shuffle
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Randomly shuffle question order
            </p>
            <Button variant="outline" size="sm">
              <Shuffle className="size-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
