import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Appointment, User } from "@shared/schema";

export default function Appointments() {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      instructorId: "",
      date: new Date(),
      time: "",
    },
  });

  const { data: instructors } = useQuery<User[]>({
    queryKey: ["/api/instructors"],
  });

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const createAppointment = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Schedule New Lesson</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Driving Lesson</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createAppointment.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="instructorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an instructor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {instructors?.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id.toString()}>
                              {instructor.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                  Schedule Lesson
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {appointments?.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Driving Lesson</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(appointment.startTime), "PPP")}
              </p>
            </div>
            <Badge variant={appointment.status === "completed" ? "secondary" : "default"}>
              {appointment.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}