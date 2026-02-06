import { FileText, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const mockTemplates = [
  {
    id: "TPL-001",
    name: "Multiple Choice - Basic",
    description: "Standard 4-option multiple choice",
    usageCount: 245,
  },
  {
    id: "TPL-002",
    name: "Fill in the Blank",
    description: "Single blank completion question",
    usageCount: 189,
  },
  {
    id: "TPL-003",
    name: "True/False",
    description: "Simple true or false question",
    usageCount: 134,
  },
];

export function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Templates</h2>
          <p className="text-gray-600">
            Create and manage reusable question templates
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <FileText className="size-8 text-blue-600" />
              <Badge variant="outline">{template.usageCount} uses</Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Use
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
