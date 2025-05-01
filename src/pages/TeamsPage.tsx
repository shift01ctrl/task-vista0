import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Users, Edit, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; // User IDs
}

const TeamsPage = () => {
  // Load users from localStorage (created in UsersPage)
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  // Load or initialize teams from localStorage
  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem("teams");
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    selectedMembers: [] as string[]
  });
  
  const createTeam = () => {
    if (!newTeam.name) {
      toast.error("Please enter a team name");
      return;
    }
    
    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      members: newTeam.selectedMembers
    };
    
    const updatedTeams = [...teams, team];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    
    setNewTeam({
      name: "",
      description: "",
      selectedMembers: []
    });
    
    setIsCreateTeamDialogOpen(false);
    toast.success(`Team ${team.name} created successfully! 🎉`);
  };

  const addMemberToTeam = () => {
    if (!selectedTeamId) return;
    
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeamId) {
        // Filter out duplicates
        const uniqueMembers = [...new Set([...team.members, ...newTeam.selectedMembers])];
        return { ...team, members: uniqueMembers };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setIsAddMemberDialogOpen(false);
    setNewTeam({...newTeam, selectedMembers: []});
    setSearchTerm("");
    toast.success("Team members updated successfully! 👥");
  };
  
  const removeTeam = (id: string) => {
    const updatedTeams = teams.filter(team => team.id !== id);
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    toast.success("Team removed successfully");
  };
  
  const removeMember = (teamId: string, userId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: team.members.filter(id => id !== userId) };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    toast.success("Team member removed");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };
  
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Filter users based on search term and who are not already in the team
  const filteredUsers = (teamId: string | null) => {
    if (!teamId) return users;
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return users;

    return users.filter(user => {
      const isAlreadyMember = team.members.includes(user.id);
      const matchesSearch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      return !isAlreadyMember && matchesSearch;
    });
  };
  
  return (
    <PageLayout title="Teams Management 👪">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">Create and manage your teams</p>
        </div>
        
        {/* Create Team Dialog */}
        <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Users className="h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team 👪</DialogTitle>
              <DialogDescription>
                Create a new team and add members to collaborate on tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Marketing Team"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team-description">Description</Label>
                <Input
                  id="team-description"
                  placeholder="Team responsible for marketing campaigns"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Team Members</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={`user-${user.id}`} 
                          checked={newTeam.selectedMembers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewTeam({
                                ...newTeam, 
                                selectedMembers: [...newTeam.selectedMembers, user.id]
                              });
                            } else {
                              setNewTeam({
                                ...newTeam, 
                                selectedMembers: newTeam.selectedMembers.filter(id => id !== user.id)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`user-${user.id}`} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground">({user.role})</span>
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-2">
                      No users available. Please add users first.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>Cancel</Button>
              <Button onClick={createTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Add Member Dialog - Enhanced to match Users page style */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={(open) => {
        setIsAddMemberDialogOpen(open);
        if (!open) {
          setSearchTerm("");
          setNewTeam({...newTeam, selectedMembers: []});
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Members 👥</DialogTitle>
            <DialogDescription>
              Select users to add to this team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Label htmlFor="search-users">Search Users</Label>
            <Input
              id="search-users"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
          </div>
          
          <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
            {filteredUsers(selectedTeamId).length > 0 ? (
              filteredUsers(selectedTeamId).map((user) => (
                <div key={user.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id={`add-user-${user.id}`} 
                    checked={newTeam.selectedMembers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setNewTeam({
                          ...newTeam, 
                          selectedMembers: [...newTeam.selectedMembers, user.id]
                        });
                      } else {
                        setNewTeam({
                          ...newTeam, 
                          selectedMembers: newTeam.selectedMembers.filter(id => id !== user.id)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`add-user-${user.id}`} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{user.role}</span>
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-2">
                {searchTerm ? "No matching users found." : "No users available to add."}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddMemberDialogOpen(false);
              setSearchTerm("");
              setNewTeam({...newTeam, selectedMembers: []});
            }}>
              Cancel
            </Button>
            <Button 
              onClick={addMemberToTeam}
              disabled={newTeam.selectedMembers.length === 0}
            >
              Add Members ({newTeam.selectedMembers.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Teams List - Enhanced to match Users page card style */}
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {team.name}
                    </CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Team Members ({team.members.length})</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setNewTeam({...newTeam, selectedMembers: []});
                      setIsAddMemberDialogOpen(true);
                    }}
                    className="gap-1"
                  >
                    <UserPlus className="h-3 w-3" />
                    Add Members
                  </Button>
                </div>
                
                {team.members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {team.members.map((memberId) => {
                      const user = getUserById(memberId);
                      if (!user) return null;
                      
                      return (
                        <div key={memberId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                              <div className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full mt-1">{user.role}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMember(team.id, memberId)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No members in this team yet.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">👪</div>
          <h3 className="text-xl font-medium">No Teams Created Yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">Create your first team to start collaborating</p>
          <Button 
            onClick={() => setIsCreateTeamDialogOpen(true)}
            className="mx-auto"
          >
            <Users className="mr-2 h-4 w-4" />
            Create Your First Team
          </Button>
        </Card>
      )}
    </PageLayout>
  );
};

export default TeamsPage;
