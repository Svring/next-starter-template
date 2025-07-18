"use client";

import type { AiState } from "@/contexts/ai-context/ai-machine";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Database,
  Globe,
  Key,
  Folder,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactJson from "react-json-view";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StateCardProps {
  state: AiState;
  className?: string;
}

export function StateCard({ state, className }: StateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasApiKey = !!state.api_key;
  const hasProjects =
    state.project_context?.homepageData?.projects?.length > 0;
  const hasCurrentProject = !!state.project_context?.flowGraphData?.project;
  const hasResources =
    state.project_context?.flowGraphData?.resources?.length > 0;

  const [showProjectsJson, setShowProjectsJson] = useState(false);
  const [showCurrentProjectJson, setShowCurrentProjectJson] = useState(false);
  const [showResourcesJson, setShowResourcesJson] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full", className)}
    >
      <Card>
        <div className="flex items-center justify-between p-6 pb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">AI Configuration</CardTitle>
            </div>
            <CardDescription>
              Current AI assistant state and configuration
            </CardDescription>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0 p-6">
            {/* Model & System Configuration */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Model Configuration
              </h4>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <Badge variant="secondary">{state.model}</Badge>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground flex-shrink-0">
                    System Prompt:
                  </span>
                  <span className="text-right text-xs font-mono bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                    {state.system_prompt}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Connection Configuration */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Connection
              </h4>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Base URL:</span>
                  </div>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded max-w-[150px] truncate">
                    {state.base_url || "(not set)"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">API Key:</span>
                  </div>
                  <Badge variant={hasApiKey ? "default" : "destructive"}>
                    {hasApiKey ? "Configured" : "Missing"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Project Context */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Project Context
              </h4>

              <div className="grid grid-cols-1 gap-3 text-sm">
                {/* Projects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Projects:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasProjects ? "default" : "secondary"}>
                        {hasProjects
                          ? `${state.project_context.homepageData.projects.length} loaded`
                          : "None"}
                      </Badge>
                      {hasProjects && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => setShowProjectsJson(!showProjectsJson)}
                        >
                          {showProjectsJson ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {showProjectsJson && hasProjects && (
                    <div className="bg-muted p-3 rounded overflow-auto max-h-64">
                      <ReactJson
                        src={state.project_context.homepageData.projects}
                        theme="rjv-default"
                        name={false}
                        collapsed={1}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={false}
                        style={{
                          fontSize: "12px",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Current Project */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Current Project:
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={hasCurrentProject ? "default" : "secondary"}
                      >
                        {hasCurrentProject ? "Active" : "None"}
                      </Badge>
                      {hasCurrentProject && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            setShowCurrentProjectJson(!showCurrentProjectJson)
                          }
                        >
                          {showCurrentProjectJson ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {showCurrentProjectJson && hasCurrentProject && (
                    <div className="bg-muted p-3 rounded overflow-auto max-h-64">
                      <ReactJson
                        src={state.project_context.flowGraphData.project}
                        theme="rjv-default"
                        name={false}
                        collapsed={1}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={false}
                        style={{
                          fontSize: "12px",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Resources */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Resources:
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hasResources ? "default" : "secondary"}>
                        {hasResources
                          ? `${state.project_context.flowGraphData.resources.length} loaded`
                          : "None"}
                      </Badge>
                      {hasResources && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            setShowResourcesJson(!showResourcesJson)
                          }
                        >
                          {showResourcesJson ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {showResourcesJson && hasResources && (
                    <div className="bg-muted p-3 rounded overflow-auto max-h-64">
                      <ReactJson
                        src={state.project_context.flowGraphData.resources}
                        theme="rjv-default"
                        name={false}
                        collapsed={1}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        enableClipboard={false}
                        style={{
                          fontSize: "12px",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={hasApiKey ? "default" : "destructive"}>
                {hasApiKey ? "Ready" : "Configuration Required"}
              </Badge>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
