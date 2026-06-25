import type { CreateIssueInput, UpdateIssueInput } from "../validations/issue.validations";

export interface Issue {
    id: string;
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "Low" | "Medium" | "High";
    project: {
        id: string,
        name: string,
        emoji: string
    }
    assignedTo: string;
    createdBy: string;
    assignee: {
        id: string;
        user: {
            id: string;
            name: string;
            avatar?: string;
            email: string;
        }
    };
    creator: {
        id: string;
        user: {
            id: string;
            name: string;
            avatar?: string;
            email: string;
        }
    };
    createdAt: string;
    updatedAt: string;
}


export type IssueStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type IssuePriority = "Low" | "Medium" | "High";



export type CreateIssueParams = {
    workspaceSlug: string;
    projectId: string;
    data: CreateIssueInput;
};

export type UpdateIssueParams = {
    workspaceSlug: string;
    projectId: string;
    issueId: string;
    data: UpdateIssueInput;
};

export type UpdateIssueStatusParams = {
    workspaceSlug: string;
    projectId: string;
    issueId: string;
    status: IssueStatus;
};

export type DeleteIssueParams = {
    workspaceSlug: string;
    projectId: string;
    issueId: string;
};

