import { Wand2, Plus } from "lucide-react";
import { Button } from "../ui/button";

export function QuestionGenerationPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 text-center">
        <Wand2 className="size-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Question Generation
        </h2>
        <p className="text-gray-600 mb-6">
          Generate questions automatically using AI based on skills and difficulty
        </p>
        <Button className="gap-2" size="lg">
          <Plus className="size-5" />
          Start Generating Questions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Quick Generate</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate questions quickly with preset templates
          </p>
          <Button variant="outline" className="w-full">
            Quick Generate
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Custom Generate</h3>
          <p className="text-sm text-gray-600 mb-4">
            Fine-tune generation with advanced options
          </p>
          <Button variant="outline" className="w-full">
            Custom Generate
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Batch Generate</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate multiple questions at once
          </p>
          <Button variant="outline" className="w-full">
            Batch Generate
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Generations
        </h3>
        <p className="text-gray-500 text-center py-8">
          No questions generated yet. Start generating to see them here.
        </p>
      </div>
    </div>
  );
}
