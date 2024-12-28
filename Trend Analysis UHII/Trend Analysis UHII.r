# Load necessary libraries
library(ggplot2)

# Load data for multiple cities
cities <- list(
  "City1" = "city1_trends.csv",
  "City2" = "city2_trends.csv",
  "City3" = "city3_trends.csv"
)

# Define the years for analysis
years <- c(2010, 2014, 2018, 2022)

# Initialize an empty list to store results for all cities
all_results <- list()

# Function to calculate trends and generate visualizations for a single city
analyze_city <- function(city_name, file_path) {
  # Load data
  data <- read.csv(file_path)
  
  # Initialize a data frame to store the trend results
  n_rows <- nrow(data)
  trend_data <- data.frame(Row = 1:n_rows, Trend = numeric(n_rows), P_Value = numeric(n_rows))

  # Loop through each row to calculate trends and p-values
  for (i in 1:n_rows) {
    response_values <- as.numeric(c(data[i, 2:5]))  # Extract the row data
    model <- lm(response_values ~ years)  # Linear regression
    trend_data$Trend[i] <- coef(model)[2]  # Store the slope
    trend_data$P_Value[i] <- summary(model)$coefficients[2, 4]  # Store the p-value
  }

  # Summarize trends
  mean_trend <- mean(trend_data$Trend, na.rm = TRUE)
  num_positive_trends <- sum(trend_data$Trend > 0, na.rm = TRUE)
  num_negative_trends <- sum(trend_data$Trend < 0, na.rm = TRUE)
  num_significant_trends <- sum(trend_data$P_Value < 0.05, na.rm = TRUE)
  num_significant_positive_trends <- sum(trend_data$Trend > 0 & trend_data$P_Value < 0.05, na.rm = TRUE)
  num_significant_negative_trends <- sum(trend_data$Trend < 0 & trend_data$P_Value < 0.05, na.rm = TRUE)

  # Print summary statistics
  cat("City:", city_name, "\n")
  cat("Mean Trend:", mean_trend, "\n")
  cat("Number of Positive Trends:", num_positive_trends, "\n")
  cat("Number of Negative Trends:", num_negative_trends, "\n")
  cat("Number of Significant Trends:", num_significant_trends, "\n")
  cat("Number of Significant Positive Trends:", num_significant_positive_trends, "\n")
  cat("Number of Significant Negative Trends:", num_significant_negative_trends, "\n")

  # Visualizations
  # Histogram of Trends
  ggplot(trend_data, aes(x = Trend)) + 
    geom_histogram(binwidth = 0.05, fill = "blue", color = "black", alpha = 0.7) + 
    theme_minimal() + 
    labs(title = paste("Distribution of UHII Trends for", city_name), x = "Trend", y = "Count")

  # Scatter plot of Trend vs P-Value
  ggplot(trend_data, aes(x = Trend, y = P_Value)) +
    geom_point(aes(color = (P_Value <= 0.05)), size = 3) + 
    geom_hline(yintercept = 0.05, linetype = "dashed", color = "red") + 
    labs(title = paste("Trend vs P-Value for", city_name),
         x = "Trend",
         y = "P-Value",
         color = "Significant at 0.05") +
    scale_color_manual(values = c("TRUE" = "blue", "FALSE" = "black")) +
    theme_minimal()

  # Boxplot of UHII values by Year
  boxplot(data[,2:5], names = years, main = paste("Boxplots of UHII values by Year for", city_name), ylab = "UHII")

  # Return results for the city
  return(trend_data)
}

# Loop through all cities and analyze each
for (city in names(cities)) {
  file_path <- cities[[city]]
  all_results[[city]] <- analyze_city(city, file_path)
}

# Combine all results into one data frame
combined_results <- do.call(rbind, lapply(names(all_results), function(city) {
  cbind(City = city, all_results[[city]])
}))

# Export combined results
write.csv(combined_results, "combined_trend_results.csv", row.names = FALSE)
